import { Box, Button, Container, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, totalCents } = useCart();
  const navigate = useNavigate();
  const totalInDollars = (totalCents / 100).toFixed(2);

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5" component="h1">
          Your cart is empty.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {cart.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <img src={item.image_url} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body1">
                    ₹{(item.price_cents / 100).toFixed(2)} each
                  </Typography>
                </Box>
                <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={clearCart} color="error">
                Clear Cart
              </Button>
              <Typography variant="h5">Total: ₹{totalInDollars}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total: ₹{totalInDollars}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;