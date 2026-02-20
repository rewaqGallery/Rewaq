import { apiRequest } from "./api";

const normalizeItem = (item) => ({
  _id: item._id ?? "",
  quantity: item.quantity ?? 0,
  price: item.product?.price ?? item.price ?? 0,

  productId: item.product?._id ?? item.product ?? "",
  code: item.product?.code ?? "",
  image: item.product?.imageCover?.url ?? "",
});

const normalizeCart = (res) => {
  const cart = res?.data ?? res;
  const items = cart?.cartItems ?? [];
  return { msg: res?.msg ?? null, items: items.map(normalizeItem) };
};

/*
{
    "status": "Success",
    "message": "Get Cart Successfully",
    "numberOfItems": 3,
    "data": {
        "_id": "697301852916d40791fb657a",
        "cartItems": [
            {
                "product": {
                    "imageCover": {
                        "url": "https://res.cloudinary.com/devvhrvcg/image/upload/v1769011919/products/cv9rf1qwjgwpcxbtkyqx.jpg",
                        "public_id": "products/cv9rf1qwjgwpcxbtkyqx"
                    },
                    "_id": "69700fcde145ddee89df7afc",
                    "code": "11",
                    "price": 25
                },
                "quantity": 7,
                "price": 25,
                "_id": "697c142bf14bc8c10cc7e646"
            },
        ],
        "totalCartPrice": 435,
        "user": "695ff7e8f3d9ff56f8f9f52f",
        "createdAt": "2026-01-23T05:05:09.127Z",
        "updatedAt": "2026-02-01T05:43:32.863Z",
        "__v": 8
    }
}
*/
export async function getCart() {
  const res = await apiRequest("/cart", { method: "GET" });
  return normalizeCart(res);
}

/*
{
    "status": "Success",
    "message": "Product Added To Cart Successfully",
    "numberOfItems": 1,
    "data": {
        "_id": "69845c3966fcf7a7064b65e6",
        "cartItems": [
            {
                "product": {
                    "imageCover": {
                        "url": "https://res.cloudinary.com/devvhrvcg/image/upload/v1769011919/products/cv9rf1qwjgwpcxbtkyqx.jpg",
                        "public_id": "products/cv9rf1qwjgwpcxbtkyqx"
                    },
                    "_id": "69700fcde145ddee89df7afc",
                    "code": "11",
                    "price": 25
                },
                "quantity": 6,
                "price": 25,
                "_id": "698465d566fcf7a7064b67b6"
            }
        ],
        "totalCartPrice": 150,
        "user": "695ff7e8f3d9ff56f8f9f52f",
        "createdAt": "2026-02-05T09:00:41.748Z",
        "updatedAt": "2026-02-05T10:13:07.628Z",
        "__v": 3
    }
}
*/
export async function addToCart(productId, quantity = 1) {
  const res = await apiRequest("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
  return normalizeCart(res);
}
/*
{
    "status": "Success",
    "message": "Update Cart Sucessfully",
    "numberOfItems": 1,
    "data": {
        "_id": "69845c3966fcf7a7064b65e6",
        "cartItems": [
            {
                "product": {
                    "imageCover": {
                        "url": "https://res.cloudinary.com/devvhrvcg/image/upload/v1769011919/products/cv9rf1qwjgwpcxbtkyqx.jpg",
                        "public_id": "products/cv9rf1qwjgwpcxbtkyqx"
                    },
                    "_id": "69700fcde145ddee89df7afc",
                    "code": "11",
                    "price": 25
                },
                "quantity": 2,
                "price": 25,
                "_id": "698465d566fcf7a7064b67b6"
            }
        ],
        "totalCartPrice": 50,
        "user": "695ff7e8f3d9ff56f8f9f52f",
        "createdAt": "2026-02-05T09:00:41.748Z",
        "updatedAt": "2026-02-05T10:13:51.617Z",
        "__v": 3
    }
}*/
export async function updateCartItem(productId, quantity) {
  const res = await apiRequest(`/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return normalizeCart(res);
}
/*
{
    "status": "Success",
    "message": "Item Removed From Cart Successfully",
    "numberOfItems": 1,
    "data": {
        "_id": "69845c3966fcf7a7064b65e6",
        "cartItems": [
            {
                "product": {
                    "imageCover": {
                        "url": "https://res.cloudinary.com/devvhrvcg/image/upload/v1768952784/products/idqcaxpoadkrya1dogdq.jpg",
                        "public_id": "products/idqcaxpoadkrya1dogdq"
                    },
                    "_id": "6970133018890973478bc656",
                    "code": "2",
                    "price": 20
                },
                "quantity": 1,
                "price": 20,
                "_id": "69846e22dcd8cb4250ee13ca"
            }
        ], //! or "cartItems" : []
        "totalCartPrice": 20,
        "user": "695ff7e8f3d9ff56f8f9f52f",
        "createdAt": "2026-02-05T09:00:41.748Z",
        "updatedAt": "2026-02-05T10:17:36.079Z",
        "__v": 5
    }
}
*/
export async function removeFromCart(productId) {
  const res = await apiRequest(`/cart/${productId}`, {
    method: "DELETE",
  });
  return normalizeCart(res);
}
