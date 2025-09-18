import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Project Alpha
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/cart">
            Cart
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.800', color: 'white' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Project Alpha
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;