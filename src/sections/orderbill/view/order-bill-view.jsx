import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fCurrency, fPercent } from 'src/utils/format-number';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { useGetSingleSale } from 'src/api/sales';

import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import OrderBillToolbar from '../order-bill-toolbar';

export default function OrderBillView({ id, iskot }) {
  const settings = useSettingsContext();
  const printSectionRef = useRef();

  const { sale, saleLoading } = useGetSingleSale(id, { expand: true, orderList: true });

  const navigate = useNavigate();

  const PrintPage = useCallback(() => {
    const printWindow = document.createElement('iframe');
    document.body.appendChild(printWindow);

    const pri = printWindow.contentWindow;
    pri.document.open();
    pri.document.write('<html><head><title>Print</title></head><body>');

    // Create a promise to wait for the image to load
    const loadImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = (error) => reject(error);
      img.src = '/assets/images/logo/KarmaEspresso.png';
    });

    // After the image is loaded, write the content to the iframe and print
    loadImagePromise
      .then(() => {
        pri.document.write(printSectionRef.current.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      })
      .finally(() => {
        // Remove the iframe after printing
        printWindow.parentNode.removeChild(printWindow);
        navigate('/dashboard/sale');
      });
  }, [navigate]);

  useEffect(() => {
    if (!saleLoading) {
      PrintPage();
    }
  }, [saleLoading, PrintPage]);

  if (saleLoading) {
    return <LoadingScreen />;
  }

  function calculateItemTotalPrice(actualPrice, qunatity) {
    return actualPrice * qunatity;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <OrderBillToolbar
          backLink={paths.dashboard.order.root}
          orderNumber={sale?.order_no}
          createdAt={sale?.createdAt}
          status={sale?.status}
          statusOptions={ORDER_STATUS_OPTIONS}
        />
        <div id="printSection" ref={printSectionRef}>
          <div
            className="page"
            style={{
              pageBreakBefore: 'always',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  alt="shop"
                  // alt="Shop Logo"
                  src="/assets/images/logo/KarmaEspresso.png" // Replace with your logo path
                  style={{ width: '60px', height: '60px' }}
                />
              </div>

              {/*  */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    textTransform: 'uppercase',
                    latterSpacing: '8px',
                    marginTop: '20px',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '17px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    KARMA ESPRESSO
                  </strong>

                  <small
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        marginTop: '3px',
                      }}
                    >
                      9714473304
                    </div>
                    <div
                      style={{
                        marginTop: '3px',
                        width: '50%',
                      }}
                    >
                      266 , 2nd Floor, Laxmi Enclave, 2, Gajera Circle, Katargam, Surat, Gujarat
                      395004
                    </div>
                  </small>
                </div>
              </div>

              {/* this is info sections */}
              <div
                style={{
                  textTransform: 'uppercase',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      marginTop: '10px',
                    }}
                  >
                    Innovoice Date:
                  </div>
                  <div>{sale?.createdAt?.split('T')[0]}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}
                  >
                    Innovoice Id:
                  </div>
                  <div>#{sale?.order_no}</div>
                </div>
                {/*
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}>Order Taker:</div>
                  <div>
                    Rose Finch
                  </div>
                </div> */}
              </div>

              {/* this is a customer sections */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '13px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}
                  >
                    Customer Name:
                  </div>
                  <div>{sale?.customer?.name}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '3px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}
                  >
                    Customer Phone:
                  </div>
                  <div>{sale?.customer?.phone}</div>
                </div>

                <div
                  style={{
                    marginTop: '10px',
                  }}
                >
                  {sale?.orderList?.map((order, index) => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'space-between',
                        borderTop: '1.9px solid #000',
                        paddingTop: '5px',
                        marginTop: '7px',
                      }}
                    >
                      <div>
                        {' '}
                        #{index + 1} - {order?.menuItems?.itemName}
                      </div>
                      {!iskot && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              borderBottom: '1.9px solid #000',
                              borderLeft: '1.9px solid #000',
                              paddingLeft: '5px',
                            }}
                          >
                            {order?.quantity}{' '}
                          </div>
                          <div
                            style={{
                              borderLeft: '1.9px solid #000',
                              padding: '5px',
                            }}
                          >
                            {calculateItemTotalPrice(order?.price, order?.quantity)}
                          </div>
                        </div>
                      )}

                      {iskot && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              borderBottom: '1.9px solid #000',
                              borderLeft: '1.9px solid #000',
                              paddingLeft: '5px',
                            }}
                          >
                            {order?.price} x {order?.quantity}{' '}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* this is total section */}
              {!iskot && (
                <div
                  style={{
                    textTransform: 'uppercase',
                    marginTop: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Items:
                    </div>
                    <div>{sale?.orderList?.length}</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      SubTotal:
                    </div>
                    <div>{fCurrency(sale?.subtotal)}</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Discount (-):
                    </div>
                    <div>{fPercent(sale?.discount)}</div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Tax (+):
                    </div>
                    <div>{fPercent(sale?.tax)}</div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Tip (+):
                    </div>
                    <div>{fCurrency(sale?.tip)}</div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Total Payable :
                    </div>
                    <div>{fCurrency(sale?.grand_total)}</div>
                  </div>
                </div>
              )}
              {/* <div style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                marginTop: '20px'
              }}>
                20240514
              </div> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

OrderBillView.propTypes = {
  id: PropTypes.string,
  iskot: PropTypes.bool,
};
