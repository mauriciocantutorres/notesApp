import { Item } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()

  const amount = data.get("amount")
  const name = data.get("name")

  if (typeof name !== "string") {
    throw Error("Please provide a name");
  }

  const item = await db.item.create({
    data: {
      amount: amount ? Number(amount) : null,
      name,
    },
  });

  return json(item);
};

export const loader: LoaderFunction = async () => {
  const items = await db.item.findMany();

  return json(items);
};

export default function Index() {
  const items = useLoaderData<Item[]>()

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-medium">Grocery Listmaker</h1>

      <Form className="mt-4 flex space-x-3 items-end" method="post">
        <div className="flex flex-col space-y-1">
          <label htmlFor="name">Item</label>
          <input className="rounded-md border bg-white shadow-sm px-3 py-2" type="text" placeholder="Item name" name="name" id="name" required />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="amount">Cost</label>
          <input className="rounded-md border bg-white shadow-sm px-3 py-2" type="number" placeholder="Item cost" name="amount" id="amount" required />
        </div>

        <button className="rounded-md border border-green-500 bg-green-500 text-white px-3 py-2" type="submit">Add</button>
      </Form>

      <ul className="mt-3 flex flex-col rounded-md bg-white shadow border divide-y">
        {items.map((item) => (
          <li key={item.id} className="p-3 flex justify-between items-center">
            <h5 className="font-medium">{item.name}</h5>
            <div>
              <span className="text-gray-500 px-3">{item.amount}</span>

              <Form method="delete" action={`/items/${item.id}`}>
                <button className="rounded bg-red-500 text-white px-2 py-1 text-sm" type="submit">Delete</button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
