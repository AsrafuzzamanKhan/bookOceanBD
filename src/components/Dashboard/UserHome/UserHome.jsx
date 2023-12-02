import { Helmet } from "react-helmet-async";
import useUserOrder from "../../../hooks/useUserOrder";

const UserHome = () => {
    const [order] = useUserOrder()
    console.log(order);
    const approve = order.filter(pd => pd.status === 'approve');
    const pending = order.filter(pd => pd.status === 'pending');
    const cancel = order.filter(pd => pd.status === 'canceled');
    const deliver = order.filter(pd => pd.status === 'delivered');
    console.log('approve', approve.lenght)
    return (
        <div>
            <Helmet>
                <title>Book Ocean BD ||  Order Summary</title>
            </Helmet>

            <div className=" text-white text-2xl font-semibold text-center mb-12 bg-[#081A51] py-12">
                Order Summary
            </div>

            <div className="px-12">
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full dark:text-white ">

                    <div className="stat bg-blue-200 flex flex-col justify-center items-center h-[250px] ">
                        <div className="stat-title dark:text-white font-semibold">Delivered</div>
                        <div className="stat-value">{deliver.length}  </div>
                    </div>
                    <div className="stat bg-green-400 flex flex-col justify-center items-center h-[250px]  ">
                        <div className="stat-title dark:text-white font-semibold">Approved</div>
                        <div className="stat-value">{approve.length}  </div>
                    </div>

                    <div className="stat bg-blue-400 flex flex-col justify-center items-center h-[250px]  ">
                        <div className="stat-title dark:text-white font-semibold">Pending</div>
                        <div className="stat-value">  {pending.length}</div>

                    </div>
                    <div className="stat bg-red-400 flex flex-col justify-center items-center h-[250px] ">
                        <div className="stat-title dark:text-white font-semibold">Canceled</div>
                        <div className="stat-value">  {cancel.length}</div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserHome;