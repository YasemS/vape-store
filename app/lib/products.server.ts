import prisma from "./prisma.server";

type GetProductOpts = {
  // orderBy?: "";

  skip?: number;
  take?: number;
};

export async function getProducts({ skip, take }: GetProductOpts = {}) {
  const products = await prisma.product.findMany({
    take,
    skip,
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
        orderBy: {
          url: "asc",
        },
        take: 1,
      },
    },
  });

  return products;
}

export async function getSimilarProducts(productId: string) {
  const products = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
        orderBy: {
          url: "asc",
        },
        take: 1,
      },
    },
  });

  return products;
}

export async function getProductBySlug(productSlug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
        orderBy: {
          url: "asc",
        },
      },
      variants: {
        select: {
          id: true,
          name: true,
          options: {
            select: {
              id: true,
              name: true,
              imageId: true,
            },
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
      reviews: {
        select: {
          id: true,
          author: true,
          content: true,
          rating: true,
          created: true,
        },
        orderBy: {
          rating: "desc",
        },
      },
      specifications: {
        select: {
          id: true,
          name: true,
          value: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return product;
}
