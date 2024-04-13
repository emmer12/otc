import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Page404,
  Escrow,
  Chart,
  Claim,
  MyListings,
  Profile,
  History,
  HowTo,
  KybarSwap,
  Widget,
  CreateList,
  List,
  Home,
  Trades,
  P2p,
  ListDetails,
  NFTHome,
} from "../views";
import MainLayout from "../views/layouts/main";
import Dashboard from "../views/layouts/dashboard";

const HomeLazy = React.lazy(() => import("../views/home"));
const CreateListLazy = React.lazy(() => import("../views/list/create"));
const ListLazy = React.lazy(() => import("../views/list"));
const TradesLazy = React.lazy(() => import("../views/trades"));
const P2pLazy = React.lazy(() => import("../views/p2p"));

const AnimatedRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/list/create" element={<CreateList />} />
        <Route path="/list" element={<List />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/p2p" element={<P2p />} />
        <Route path="/how-to" element={<HowTo />} />
        <Route path="/swap" element={<KybarSwap />} />
        <Route path="/widget" element={<Widget />} />
        <Route path="/test-tokens" element={<Claim />} />
        <Route path="doc" element={<Escrow />} />
        <Route path="/trades/:id" element={<Trades />} />
        <Route path="/list/:id" element={<ListDetails />} />
        <Route path="/nfts" element={<NFTHome />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MyListings />} />
          <Route path="/dashboard/my-listings" element={<MyListings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/history" element={<History />} />
        </Route>
        <Route path="/:chain" element={<Home />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default AnimatedRouter;
