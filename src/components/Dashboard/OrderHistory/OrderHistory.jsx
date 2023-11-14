import useAuth from "../../../hooks/useAuth";

const OrderHistory = () => {
    const { user } = useAuth()
    console.log('user history', user)
    return (
        <div>
            {user.displayName} Order historyadad
        </div>
    );
};

export default OrderHistory;