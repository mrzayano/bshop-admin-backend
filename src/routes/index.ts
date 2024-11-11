import express, { Request, Response } from 'express';
import { supabase } from '@/utils/supabaseClient'; // Ensure your path is correct

const router = express.Router();

// Route to get all products with optional search functionality
// Route to get all products
router.get('/products', async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
        console.error("Error fetching products from Supabase:", error.message);
        return res.status(500).json({ error: error.message });
    }

    console.log("Products retrieved:", data);
    res.status(200).json(data);
});





router.post('/products/add', async (req: Request, res: Response) => {
    const { names, prices, } = req.body;

    console.log("Received data:", { names, prices });

    if (!names || !prices) {
        return res.status(400).json({ error: "Both 'names' and 'prices' are required." });
    }

    try {
        const { error } = await supabase.from('products').insert([{ names, prices }]);

        if (error) {
            console.error("Error inserting product into database:", error.message);
            return res.status(500).json({ error: "Failed to add product to database." });
        }

        res.status(201).json({ message: "Product added successfully", names, prices });


    } catch (error) {
        console.error("Unexpected error adding product:", error);
        res.status(500).json({ error: "An unexpected error occurred while adding the product." });
    }
})

router.get('/products/edit/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error) {
        console.error("Error fetching product for editing:", error.message);
        return res.status(404).json({ error: "Product not found" });
    }

    console.log("Editing product:", data);
    res.status(200).json(data);
});

// Update product by ID
router.post('/products/edit/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { names, prices } = req.body;

    const { data, error } = await supabase
        .from('products')
        .update({ names, prices })
        .eq('id', id);

    if (error) {
        console.error("Error updating product:", error.message);
        return res.status(500).json({ error: "Failed to update product" });
    }

    console.log("Product updated:", data);
    res.status(200).json(data);
});


router.delete('/products/delete/:id', async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (deleteError) {
            console.error('Error deleting product:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Export the router
export default router;
