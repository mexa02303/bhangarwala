const fs = require('fs');
const path = require('path');
const os = require('os');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

class LocalStorageAdapter {
  constructor() {
    this.isServerless = !!process.env.VERCEL;
    this.uploadDir = this.isServerless ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, '../../../uploads');
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch (e) {
      // Ignored in read-only environment
    }
  }

  async uploadFile(file) {
    if (file.buffer) {
      // Memory storage fallback (base64 data URI or temp disk)
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '.jpg')}`;
      const base64 = `data:${file.mimetype || 'image/jpeg'};base64,${file.buffer.toString('base64')}`;
      return {
        url: base64,
        key: filename,
        provider: 'local-memory'
      };
    }

    const filename = file.filename || `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const url = `/uploads/${filename}`;
    return {
      url,
      key: filename,
      provider: 'local'
    };
  }
}

class S3StorageAdapter {
  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.S3_BUCKET_NAME || 'ewaste-storage-bucket';
    this.s3 = new S3Client({ region: this.region });
  }

  async uploadFile(file) {
    const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3.send(command);
    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    return {
      url,
      key,
      provider: 's3'
    };
  }
}

class StorageFactory {
  constructor() {
    const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
    if (provider === 's3') {
      this.adapter = new S3StorageAdapter();
    } else {
      this.adapter = new LocalStorageAdapter();
    }
  }

  getAdapter() {
    return this.adapter;
  }
}

module.exports = new StorageFactory().getAdapter();
