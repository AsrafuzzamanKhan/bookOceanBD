const Qty = ({ item }) => {

    console.log('inc item', item)



    return (
        <div className="flex gap-x-6 items-center  text-primary ">


            <div className="bg-gray-200">
                <div>
                    <button onClick={() => onIncrement(item._id)}>+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onDecrement(item._id)}>-</button>
                </div>
            </div>


        </div>
    );
};

export default Qty;