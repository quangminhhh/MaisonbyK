import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password,
      role: Role.ADMIN,
    },
  })

  await prisma.image.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  const traditional = await prisma.category.create({
    data: {
      name: 'Áo dài truyền thống',
      slug: 'ao-dai-truyen-thong',
      description: 'Áo dài truyền thống Việt Nam',
      imageUrl: 'https://images.unsplash.com/photo-1580584125209-5599e3dab4f2',
    },
  })

  const modern = await prisma.category.create({
    data: {
      name: 'Áo dài cách tân',
      slug: 'ao-dai-cach-tan',
      description: 'Áo dài cách tân hiện đại',
      imageUrl: 'https://images.unsplash.com/photo-1580632206411-c3e8f0a20ae6',
    },
  })

  await prisma.product.create({
    data: {
      name: 'Áo dài đỏ truyền thống',
      slug: 'ao-dai-do-truyen-thong',
      description: 'Áo dài đỏ với họa tiết truyền thống',
      price: 1000000,
      promotionalPrice: 900000,
      categoryId: traditional.id,
      sizes: ['S', 'M', 'L'],
      colors: ['Đỏ'],
      material: 'Lụa',
      stockQuantity: 10,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1520974735194-ecbd89bdf847',
            altText: 'Áo dài đỏ truyền thống',
            isDefault: true,
          },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Áo dài trắng cách tân',
      slug: 'ao-dai-trang-cach-tan',
      description: 'Áo dài trắng phong cách hiện đại',
      price: 1200000,
      promotionalPrice: 1000000,
      categoryId: modern.id,
      sizes: ['S', 'M', 'L'],
      colors: ['Trắng'],
      material: 'Lụa',
      stockQuantity: 15,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1520974735193-ecbd89bdf835',
            altText: 'Áo dài trắng cách tân',
            isDefault: true,
          },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Áo dài xanh truyền thống',
      slug: 'ao-dai-xanh-truyen-thong',
      description: 'Áo dài xanh truyền thống thanh lịch',
      price: 1100000,
      categoryId: traditional.id,
      sizes: ['S', 'M', 'L'],
      colors: ['Xanh'],
      material: 'Lụa',
      stockQuantity: 8,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1520974735192-ecbd89bdf833',
            altText: 'Áo dài xanh truyền thống',
            isDefault: true,
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
