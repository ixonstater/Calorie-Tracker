import EggIcon from "@mui/icons-material/Egg";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import SetMealIcon from "@mui/icons-material/SetMeal";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import IcecreamIcon from "@mui/icons-material/Icecream";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import CakeIcon from "@mui/icons-material/Cake";
import CookieIcon from "@mui/icons-material/Cookie";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";

const icons = [
  EggIcon,
  LunchDiningIcon,
  SetMealIcon,
  RamenDiningIcon,
  FastfoodIcon,
  LocalPizzaIcon,
  IcecreamIcon,
  EmojiFoodBeverageIcon,
  SoupKitchenIcon,
  BakeryDiningIcon,
  DinnerDiningIcon,
  CakeIcon,
  CookieIcon,
  OutdoorGrillIcon,
];

export function getRandomFoodIcon() {
  const idx = Math.floor(Math.random() * icons.length);
  return icons[idx];
}
