
import PaperFoldingApp from "../apps/PaperFoldingApp";
import WarehouseApp from "../apps/WarehouseApp";

export const apps = [
{
id:"paper",
title:"Paper Folding Explorer",
description:"Explore exponential folding patterns.",
component:PaperFoldingApp
},
{
id:"warehouse",
title:"Warehouse Discount Explorer",
description:"Compare discount-first vs tax-first.",
component:WarehouseApp
}
];
