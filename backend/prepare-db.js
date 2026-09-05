const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let dbUrl = (process.env.DATABASE_URL || '').trim();
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const pgSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');

const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

if (isPostgres) {
  console.log('⚡ Detected PostgreSQL DATABASE_URL. Switching to PostgreSQL schema...');
  if (fs.existsSync(pgSchemaPath)) {
    fs.copyFileSync(pgSchemaPath, schemaPath);
    console.log('✅ prisma/schema.prisma updated to PostgreSQL.');
  }
} else {
  console.log('⚡ Using SQLite schema.');
  if (!dbUrl || !dbUrl.startsWith('file:')) {
    console.log('⚠️ DATABASE_URL not set or not starting with file:. Defaulting to file:./dev.db');
    dbUrl = 'file:./dev.db';
    process.env.DATABASE_URL = dbUrl;
  }
}

// Make sure .env exists in backend so Prisma can always read it
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating fallback .env with DATABASE_URL...');
  fs.writeFileSync(envPath, `DATABASE_URL="${dbUrl}"\nPORT=4000\nNODE_ENV=production\n`);
}

console.log('📦 Syncing database schema with Prisma (db push)...');
try {
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
  console.log('✨ Prisma db push successful!');
} catch (error) {
  console.error('❌ Prisma db push error:', error.message);
  process.exit(1);
}

console.log('🔨 Generating Prisma Client...');
try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
  console.log('✨ Prisma client generated successfully!');
} catch (error) {
  console.error('❌ Prisma generate error:', error.message);
  process.exit(1);
}
