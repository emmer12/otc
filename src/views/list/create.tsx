import { useEffect, useState } from "react";
import { Container, Flex, Spacer, Text } from "@/components";
import { List, THeader, Transaction } from "./styles";
import { ListCard } from "@/components/Card";
import { ActionSwitch, SwitchItem2 } from "../home/styles";
import { useNavigate } from "react-router-dom";
import { ScanLogo } from "@/components/Icons";
import axios from "axios";
import { BASE_URL } from "@/helpers/apiHelper";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatDateTime, getScanLink } from "@/utils";
import Empty from "@/components/Empty";
import { truncate } from "@/helpers";
import ReactPaginate from "react-paginate";

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState([]);
  const { chainId } = useWeb3React<Web3Provider>();
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 10;
  const currentItems = transactions.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(transactions.length / 10);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % transactions.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    getTransactions();
  }, [chainId]);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const {
        data: { transactions },
      } = await axios.get(
        `${BASE_URL}/transactions?chain=${chainId ? chainId : 1}`
      );
      setTransactions(transactions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div>
        <ActionSwitch className="list" style={{ margin: "auto" }}>
          <SwitchItem2 onClick={() => navigate("/")}>Swap</SwitchItem2>
          <SwitchItem2
            onClick={() => navigate("/list/create")}
            className="active"
          >
            List
          </SwitchItem2>
        </ActionSwitch>
        <Spacer height={24} />
        <List>
          <ListCard />

          <Transaction>
            <THeader>
              <h2>Transactions</h2>
            </THeader>

            <div style={{ width: "100%", overflowX: "auto" }}>
              <table className="w-full ">
                <thead>
                  <tr className="table__header">
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Gave</th>
                    <th>Got</th>
                    <th className="right">Maker</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div>Loading</div>
                  ) : transactions.length < 1 ? (
                    <div>
                      {" "}
                      <Empty
                        msg="No Transaction"
                        subMsg="Otc transactions will show here"
                      />{" "}
                    </div>
                  ) : (
                    currentItems.map((transaction: any, i) => (
                      <tr key={i}>
                        <td>
                          {transaction.list_id.is_private ? (
                            "(Private Sale)"
                          ) : (
                            <a
                              href={getScanLink(
                                transaction.list_id.chain,
                                transaction.transaction_hash
                              )}
                              target="_blank"
                            >
                              <ScanLogo />
                            </a>
                          )}
                        </td>
                        <td>{formatDateTime(transaction.createdAt)}</td>
                        <td>
                          <div>
                            <Flex>
                              <Text size="s2" weight="400">
                                {transaction?.amount_out.toFixed(2)}
                              </Text>
                              <Spacer width={6} />
                              {transaction.list_id.is_private ? (
                                "(Private Sale)"
                              ) : (
                                <>
                                  <Text size="s2" weight="400">
                                    {
                                      transaction?.list_id?.token_out_metadata
                                        ?.symbol
                                    }
                                  </Text>
                                  <Spacer width={6} />
                                  <img
                                    style={{
                                      height: 20,
                                      width: 20,
                                      objectFit: "contain",
                                    }}
                                    onError={(e: any) =>
                                      (e.target.src = "/no-token.png")
                                    }
                                    src={
                                      transaction?.list_id?.token_out_metadata
                                        ?.icon || "/no-token.png"
                                    }
                                    alt="Logo"
                                  />
                                </>
                              )}
                            </Flex>
                          </div>
                          ~$
                          {(
                            transaction?.amount_out *
                            transaction?.list_id?.token_out_metadata.usd
                          ).toFixed(2)}
                        </td>
                        <td>
                          <div>
                            <Flex>
                              <Text size="s2" weight="400">
                                {transaction?.amount_in.toFixed(2)}
                              </Text>
                              <Spacer width={6} />
                              {transaction.list_id.is_private ? (
                                "(Private Sale)"
                              ) : (
                                <>
                                  <Text size="s2" weight="400">
                                    {
                                      transaction?.list_id?.token_in_metadata
                                        ?.symbol
                                    }
                                  </Text>
                                  <Spacer width={6} />
                                  <img
                                    style={{
                                      height: 20,
                                      width: 20,
                                      objectFit: "contain",
                                    }}
                                    onError={(e: any) =>
                                      (e.target.src = "/no-token.png")
                                    }
                                    src={
                                      transaction?.list_id?.token_in_metadata
                                        ?.icon || "/no-token.png"
                                    }
                                    alt="Logo"
                                  />
                                </>
                              )}
                            </Flex>
                          </div>
                          <small>
                            ~$
                            {(
                              transaction?.amount_in *
                              transaction?.list_id?.token_in_metadata.usd
                            ).toFixed(2)}
                          </small>
                        </td>
                        <td className="right">
                          {transaction?.list_id?.is_private
                            ? "(Private Sale)"
                            : truncate(transaction.from, 9, "***")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot style={{ width: "220px" }}>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="&#9002; "
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="&#9001;"
                    renderOnZeroPageCount={null}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    marginPagesDisplayed={2}
                  />
                </tfoot>
              </table>
            </div>
          </Transaction>
        </List>
      </div>
    </Container>
  );
};

export default CreateListing;
