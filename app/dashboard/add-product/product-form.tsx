"use client"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ProductSchema} from "@/types/product-schema";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormControl, FormMessage, FormItem, FormLabel, FormDescription} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DollarSign} from "lucide-react";
import Tiptap from "@/app/dashboard/add-product/tiptap";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import {createProduct} from "@/server/actions/create-product";



export default function ProductForm() {
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
    })

    const {execute, status} = useAction(createProduct, {
        onSuccess: (data) => {
            if (data.data?.success) {
                console.log(data.data.success)
            } else if (data.data?.error) {
                console.log(data.data.error)
            }
        }
    })

    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        execute(values)
    }

    return (


        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Product Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a title for product" {...field}
                                                   type={"text"}/>
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Tiptap val={field.value}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Product Price</FormLabel>
                                        <FormControl>
                                            <div className={"flex items-center gap-2"}>
                                                <DollarSign size={36} className={"p-2 bg-muted rounded-md"}/>
                                                <Input placeholder="Enter price for product in USD" {...field}
                                                       type={"number"} step={"0.1"} min={0}/>
                                            </div>

                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty}
                                type={"submit"}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}