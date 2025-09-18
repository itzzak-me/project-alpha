import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, CardMedia, Button } from '@mui/material';
import { useCart } from '../CartContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
      } catch (e: any) {
        console.error("Failed to fetch product:", e);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography>Product not found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            image={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.title}
            sx={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${(product.price_cents / 100).toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 'auto', width: '200px' }}
            onClick={() => product && addToCart(product, 1)}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;