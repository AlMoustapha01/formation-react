import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "../store";

/**
 * Hook useDispatch typé
 * Utiliser à la place de useDispatch standard
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook useSelector typé
 * Utiliser à la place de useSelector standard
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
