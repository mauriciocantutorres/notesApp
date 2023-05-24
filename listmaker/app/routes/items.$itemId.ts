import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ params }) => {
    const { itemId } = params;

    await db.item.delete({
        where: {
            id: itemId,
        },
    });

    return redirect("/");
};