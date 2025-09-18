import { Typography, Container, CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { totalCents, cart } = useCart();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // This is where we'll handle the Razorpay payment logic
    // For now, we'll just show a loading message
    const timer = setTimeout(() => {
      setLoading(false);
      if (!isAuthenticated) {
        setError("You must be logged in to checkout.");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      {error ? (
        <Typography color="error" variant="h6">{error}</Typography>
      ) : (
        <Typography variant="h6">
          Total: ₹{(totalCents / 100).toFixed(2)}
        </Typography>
      )}
      {/* Razorpay form will be rendered here */}
    </Container>
  );
};

export default CheckoutPage;