import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Testing database connection...')
    
    // Test the connection by running a simple query
    await prisma.$queryRaw`SELECT 1`
    
    console.log('✅ Database connection successful!')
    
    // Get database version info
    const result = await prisma.$queryRaw`SELECT version()` as any[]
    console.log('📊 Database info:', result[0]?.version)
    
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error)
    console.log('\n📝 To fix this:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to Settings > Database')
    console.log('3. Copy the connection string (use "Transaction" mode for Next.js)')
    console.log('4. Update the DATABASE_URL in your .env file')
    console.log('5. Run: npx prisma generate')
    console.log('6. Try this test again')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()