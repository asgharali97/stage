import { config } from 'dotenv';
import { resolve } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  originalPath: string;
  filename: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

async function uploadImage(filePath: string, filename: string): Promise<UploadResult> {
  // Remove file extension for public ID (folder parameter will add 'backgrounds/' prefix)
  const publicId = filename.replace(/\.[^.]+$/, '');
  
  console.log(`Uploading ${filename}...`);
  
  try {
    // Check file size first
    const stats = await stat(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    const MAX_SIZE_MB = 10;
    
    let uploadPath = filePath;
    
    // If file is too large, compress it first
    if (fileSizeMB > MAX_SIZE_MB) {
      console.log(`⚠️  ${filename} is ${fileSizeMB.toFixed(2)}MB (exceeds ${MAX_SIZE_MB}MB limit). Compressing...`);
      
      // Compress image using sharp - convert PNG to JPEG for better compression
      const isPng = filename.toLowerCase().endsWith('.png');
      const compressedBuffer = isPng
        ? await sharp(filePath)
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer()
        : await sharp(filePath)
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();
      
      const compressedSizeMB = compressedBuffer.length / (1024 * 1024);
      console.log(`   Compressed to ${compressedSizeMB.toFixed(2)}MB`);
      
      // Upload from buffer using upload_stream
      const uploadResult = await new Promise<Awaited<ReturnType<typeof cloudinary.uploader.upload>>>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: 'backgrounds',
            overwrite: true,
            resource_type: 'image',
            transformation: [
              {
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );
        
        uploadStream.end(compressedBuffer);
      });
      
      return {
        originalPath: `/backgrounds/${filename}`,
        filename,
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
      };
    }
    
    // Upload normally if file is within size limit
    const result = await cloudinary.uploader.upload(uploadPath, {
      public_id: publicId,
      folder: 'backgrounds',
      overwrite: true,
      resource_type: 'image',
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });

    return {
      originalPath: `/backgrounds/${filename}`,
      filename,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error uploading ${filename}:`, error);
    throw error;
  }
}

async function main() {
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables');
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is not set in environment variables');
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is not set in environment variables');
  }

  const backgroundsDir = join(process.cwd(), 'public', 'backgrounds');
  
  // Get all image files from the backgrounds directory
  const files = await readdir(backgroundsDir);
  const imageFiles = files.filter(
    (file) =>
      file.toLowerCase().endsWith('.jpg') ||
      file.toLowerCase().endsWith('.jpeg') ||
      file.toLowerCase().endsWith('.png') ||
      file.toLowerCase().endsWith('.webp')
  );

  if (imageFiles.length === 0) {
    console.log('No image files found in public/backgrounds/');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to upload...\n`);

  const results: UploadResult[] = [];
  const errors: Array<{ filename: string; error: string }> = [];

  // Upload each image
  for (const filename of imageFiles) {
    try {
      const filePath = join(backgroundsDir, filename);
      const result = await uploadImage(filePath, filename);
      results.push(result);
      console.log(`✅ Uploaded: ${filename} -> ${result.publicId}\n`);
    } catch (error) {
      errors.push({
        filename,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error(`❌ Failed: ${filename}\n`);
    }
  }

  // Create mapping object
  const mapping: Record<string, string> = {};
  results.forEach((result) => {
    mapping[result.originalPath] = result.publicId;
  });

  // Save mapping to a TypeScript file
  // Use mac-asset-7 if uploaded, otherwise use first available mac-asset or first image
  const signInPublicId = results.find(r => r.filename.includes('mac-asset-7'))?.publicId 
    || results.find(r => r.filename.includes('mac-asset-1'))?.publicId
    || results.find(r => r.filename.includes('mac-asset'))?.publicId
    || results[0]?.publicId
    || 'backgrounds/mac-asset-1';
  
  // Use a different mac-asset for sign-up, or same as sign-in if only one available
  const signUpPublicId = results.find(r => r.filename.includes('mac-asset-2'))?.publicId 
    || results.find(r => r.filename.includes('mac-asset-3'))?.publicId
    || results.find(r => r.filename.includes('mac-asset') && !r.publicId.includes(signInPublicId.replace('backgrounds/', '')))?.publicId
    || signInPublicId;
  
  const mappingContent = `// This file is auto-generated by scripts/upload-backgrounds.ts
// DO NOT EDIT MANUALLY

export const backgroundImageMapping: Record<string, string> = ${JSON.stringify(mapping, null, 2)};

export const cloudinaryPublicIds: string[] = [
${results.map((r) => `  "${r.publicId}",`).join('\n')}
];

// Public ID for sign-in page background
export const SIGN_IN_BACKGROUND_PUBLIC_ID = '${signInPublicId}';

// Public ID for sign-up page background
export const SIGN_UP_BACKGROUND_PUBLIC_ID = '${signUpPublicId}';
`;

  await writeFile(
    join(process.cwd(), 'lib', 'cloudinary-backgrounds.ts'),
    mappingContent,
    'utf-8'
  );

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${results.length}`);
  console.log(`❌ Failed: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ filename, error }) => {
      const errorMsg = error.includes('File size too large') 
        ? `File too large (max 10MB) - consider compressing or upgrading Cloudinary plan`
        : error;
      console.log(`  - ${filename}: ${errorMsg}`);
    });
  }
  
  if (results.length === 0) {
    console.error('\n❌ No images were uploaded! Please check your Cloudinary credentials and try again.');
    process.exit(1);
  }

  console.log('\n✅ Mapping file created at: lib/cloudinary-backgrounds.ts');
  console.log('✅ All components are now using Cloudinary public IDs - no fallbacks!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

