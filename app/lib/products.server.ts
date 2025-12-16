import prisma from "./prisma.server";

type GetProductOpts = {
  // orderBy?: "";

  skip?: number;
  take?: number;
};

export async function getProducts({ skip, take }: GetProductOpts) {
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
