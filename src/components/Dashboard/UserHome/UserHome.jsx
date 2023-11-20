import useUserOrder from "../../../hooks/useUserOrder";

const UserHome = () => {
    const [order] = useUserOrder()
    console.log(order);
    const approve = order.filter(pd => pd.status === 'approve');
    const pending = order.filter(pd => pd.status === 'pending');
    const cancel = order.filter(pd => pd.status === 'canceled');
    console.log('approve', approve.lenght)
    return (
        <div>


            <div className=" text-white text-2xl font-semibold text-center mb-12 bg-[#081A51] py-12">
                Order Summary
            </div>

            <div className="px-12">
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full dark:text-white ">

                    <div className="stat bg-green-400 flex flex-col justify-center items-center ">
                        <div className="stat-title dark:text-white">Approved</div>
                        <div className="stat-value">{approve.length}  </div>
                    </div>

                    <div className="stat bg-blue-400 flex flex-col justify-center items-center  ">
                        <div className="stat-title dark:text-white">Pending</div>
                        <div className="stat-value">  {pending.length}</div>

                    </div>
                    <div className="stat bg-red-400 flex flex-col justify-center items-center ">
                        <div className="stat-title dark:text-white">Canceled</div>
                        <div className="stat-value">  {cancel.length}</div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserHome;