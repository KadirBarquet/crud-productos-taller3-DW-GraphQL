import { useApiMode } from '../context/ApiModeContext';
import Products from '../pages/Products';
import ProductsGraphQL from '../pages/ProductsGraphQL';

const ProductsRouter = () => {
    const { isGraphQL } = useApiMode();

    // Renderizar el componente según el modo seleccionado
    return isGraphQL ? <ProductsGraphQL /> : <Products />;
};

export default ProductsRouter;