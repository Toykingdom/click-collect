"use client"
import { useEffect, useState } from 'react';
import getOrder from '@/app/lib/getorder/page';
import Link from 'next/link';

export default function OrderPage({ params: { orderId } }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(orderId);
        console.log(orderData);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    history.push('/orders');
  };

  return (
    <div>
      {order ? (
        <section className="py-5">
          <div className="max-w-5xl mx-auto bg-white">
            <article className="overflow-hidden">
              <div className="bg-[white] rounded-b-md">
                <div className="p-9">
                  <div className="space-y-6 text-slate-700">
                    <p className="text-xl font-extrabold tracking-tight uppercase font-body">
                      Click & Collect Order
                    </p>
                  </div>
                </div>
                <div className="p-9">
                  <div className="flex w-full">
                    <div className="grid grid-cols-4 gap-12">
                      <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">Invoice Detail:</p>
                        <p>{order.billing.first_name} {order.billing.last_name}</p>
                        <p>{order.billing.address_1}</p>
                        <p>{order.billing.city}</p>
                        <p>{order.billing.postcode}</p>
                        <p>{order.billing.phone}</p>
                        <p>{order.billing.email}</p>
                      </div>
                      <div className="text-sm font-light text-slate-500">
                        <p className="text-sm font-normal text-slate-700">Invoice Number</p>
                        <p>{order.id}</p>
                        <p className="mt-2 text-sm font-normal text-slate-700">Date of Issue</p>
                        <p>{order.date_created}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-9">
                  <div className="flex flex-col mx-0 mt-8">
                    <table className="min-w-full divide-y divide-slate-500">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                          >
                            Rate
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0"
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.line_items.map((item) => (
                          <tr key={item.id} className="border-b border-slate-200">
                            <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                              <div className="font-medium text-slate-700">{item.name}</div>
                              <div className="mt-0.5 text-slate-500 sm:hidden">
                                {item.quantity} unit{item.quantity > 1 ? 's' : ''} at R{item.price}
                              </div>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                              {item.quantity}
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                              R{item.subtotal}
                            </td>
                            <td className="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                              R{item.subtotal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th
                            scope="row"
                            colspan="3"
                            className="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0"
                          >
                            Discount
                          </th>
                          <th
                            scope="row"
                            className="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden"
                          >
                            Discount
                          </th>
                          <td className="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                            R{order.discount_total}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            colspan="3"
                            className="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0"
                          >
                            Total
                          </th>
                          <th
                            scope="row"
                            className="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden"
                          >
                            Total
                          </th>
                          <td className="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                            R{order.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="mt-48 p-9">
                  <div className="border-t pt-9 border-slate-200">
                    <div className="text-sm font-light text-slate-700">
                      <p>
                        Payment terms are 14 days. Please be aware that according to the Late Payment of Unwrapped
                        Debts Act 0000, freelancers are entitled to claim a 00.00 late fee upon non-payment of debts
                        after this time, at which point a new invoice will be submitted with the addition of this fee.
                        If payment of the revised invoice is not received within a further 14 days, additional interest
                        will be charged to the overdue account and a statutory rate of 8% plus Bank of England base of
                        0.5%, totaling 8.5%. Parties cannot contract out of the Act’s provisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="flex justify-center mt-8">
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500" onClick={handlePrint}>
              Print
            </button>
            <Link href="/orders" className="px-4 py-2 ml-4 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500">
              Go Back
            </Link>
          </div>
        </section>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
