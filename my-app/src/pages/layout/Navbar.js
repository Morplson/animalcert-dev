import React, { useEffect, useContext, Component } from "react";
import { Link } from "react-router-dom";
import EthAddress from "../bits/EthAddress";
import HamburgerButton from "../bits/HamburgerButton";



import { Web3Context, Web3Data } from '../../deprecated/Web3Context';

class Navbar extends Component {

  static contextType = Web3Context;

  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }

  handleConnectWallet = async () => {
    let data = await this.context.web3data.connectWallet();
    this.context.setWeb3data(data);

  }

  toggleBurger() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render() {
    let web3data = this.context.web3data;

    return (
      <React.Fragment>
        <nav className="
        flex items-center
        fixed top-0 left-0 w-screen z-50
        milky-glass shadow
        select-none  
      ">
          <HamburgerButton
            className="
            w-fit md:w-0
            mx-2
            md:hidden
          "
            onClick={this.toggleBurger.bind(this)}
            
            active={this.state.active}

          ></HamburgerButton>

          <ul className="
          hidden md:flex gap-x-2 flex-nowrap justify-center items-center
          px-2
          h-full
        ">
            <li className="nav-element">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-element">
              <Link className="nav-link" to="/animals">Show all</Link>
            </li>
            <li className="nav-element">
              <Link className="nav-link" to="/animals/0">Animal with ID 0</Link>
            </li>

            {web3data.address != null &&
              <li className="nav-element">
                <Link className="nav-link" to={"/owner/" + web3data.address}>Your Pets</Link>
              </li>
            }
          </ul>

          <div
            className="
            grow
          "
          ></div>

          <ul className="
          
          flex gap-x-2 gap-y-2.5 flex-nowrap float-right
          w-fit
          px-4 py-2.5 
        ">
            <li className="crypto-button">
              <Link to="/animals/new">Mint a token</Link>
            </li>


            <button onClick={this.handleConnectWallet} className="crypto-button">
              {web3data.address ? "Connected as " && <EthAddress>{web3data.address}</EthAddress> : "Connect Wallet"}
            </button>
          </ul>
        </nav>

        <nav name="burgerPane"
          className={
            (this.state.active ? "-translate-x-full opacity-0 " : "translate-x-0 opacity-100 ") +
            "fixed top-0 left-0 w-screen h-screen z-10 " +
            "grid  gap-1 content-center justify-center text-lg " +
            "milky-glass transition-all"
          }
        >
          <span 
            className="nav-element"
            onClick={this.toggleBurger.bind(this)}
          >
            <Link className="nav-link" to="/">Home</Link>
          </span>
          <span className="nav-element" onClick={this.toggleBurger.bind(this)}>
            <Link className="nav-link" to="/animals">Show all</Link>
          </span>
          <span className="nav-element" onClick={this.toggleBurger.bind(this)}>
            <Link className="nav-link" to="/animals/0">Animal with ID 0</Link>
          </span>
          

          {web3data.address != null &&
              <span className="nav-element" onClick={this.toggleBurger.bind(this)}>
                <Link className="nav-link" to={"/owner/" + web3data.address}>Your Pets</Link>
              </span>
              
          }

        </nav>
      </React.Fragment>
    );
  }
};
export default Navbar;

