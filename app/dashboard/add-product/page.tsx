import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import ProductForm from "@/app/dashboard/add-product/product-form";

export default async function AddProduct() {
    const session = await auth();

    if (session?.user.role !== 'admin') {
        return redirect('/dashboard/settings');
    }

    return (
        <>
            <div className={"container mx-auto"}>
                <ProductForm/>
            </div>
        </>
    )
}