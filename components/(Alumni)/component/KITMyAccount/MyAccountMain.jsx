import Link from "next/link";
import React from "react";
import AccountInfo from "../../../../data/myAccount.json"
import MyAccount from "../../../My-Account/MyAccount";

const MyAccountMain = () => {

    
  return (
    <div className="my-account-section bg-color-white rbt-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row g-5">
              <div className="col-lg-3 col-12">
                <div className="rbt-my-account-tab-button nav" role="tablist">
                  <Link
                    href="#dashboad"
                    className="active"
                    data-bs-toggle="tab"
                  >
                    Dashboard
                  </Link>
                  <Link href="#orders" data-bs-toggle="tab">
                    Orders
                  </Link>
                  <Link href="#download" data-bs-toggle="tab">
                    Download
                  </Link>
                  <Link href="#payment-method" data-bs-toggle="tab">
                    Payment Method
                  </Link>

                  <Link href="#address-edit" data-bs-toggle="tab">
                    Address
                  </Link>
                  <Link href="#account-info" data-bs-toggle="tab">
                    Account Details
                  </Link>
                  <Link href="/login">Logout</Link>
                </div>
              </div>
              <div className="col-lg-9 col-12">
                {AccountInfo &&
                  AccountInfo.account.map((data, index) => (
                    <MyAccount {...data} key={index} account={data} />

                    
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountMain;
