import { apiRequest } from "./api";

/*
{
    "itemsCount": 3,
    "data": [
        {
            "imageCover": {
                "url": "https://res.cloudinary.com/devvhrvcg/image/upload/v1769011919/products/cv9rf1qwjgwpcxbtkyqx.jpg",
                "public_id": "products/cv9rf1qwjgwpcxbtkyqx"
            },
            "_id": "69700fcde145ddee89df7afc",
            "code": "11",
            "price": 25
        },
    ]
} */

export async function getFavourites() {
  const res = await apiRequest("/favourites", { method: "GET" });

  const items = res?.data ?? [];
  const ids = items.map((item) => item._id);

  return {
    ids,
    products: items,
  };
}

/*
  {
      "status": "Success",
      "message": "Product Added Suceessfully To Your Favourites",
      "data": [
          "6970140018890973478bc666"
      ]
  }
*/
export async function addFavourite(productId) {
  const res = await apiRequest("/favourites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
  return productId;
}

/*
  {
      "status": "Success",
      "message": "Product Removed SuceesFully From Your Favourites",
      "data": [
          "69700fcde145ddee89df7afc",
          "6970133018890973478bc656"
      ]
} 
*/
export async function removeFavourite(productId) {
  let res = await apiRequest("/favourites", {
    method: "DELETE",
    body: JSON.stringify({ productId }),
  });
  return productId;
}
