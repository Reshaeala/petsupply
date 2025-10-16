class ProductsController {
    private products: Array<{ id: number; name: string; price: number; description: string }> = [
        { id: 1, name: "Dog Food", price: 29.99, description: "High-quality dog food." },
        { id: 2, name: "Cat Food", price: 24.99, description: "Nutritious cat food." },
        { id: 3, name: "Dog Toy", price: 9.99, description: "Durable dog toy." },
    ];

    public getAllProducts(req: any, res: any): void {
        res.json(this.products);
    }

    public getProductById(req: any, res: any): void {
        const productId = parseInt(req.params.id);
        const product = this.products.find(p => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    }
}

export default new ProductsController();