import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
      } catch (e: any) {
        console.error("Failed to fetch products:", e);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Our Products</h1>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card>
                <img src={product.image_url || 'https://via.placeholder.com/250'} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${(product.price_cents / 100).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;