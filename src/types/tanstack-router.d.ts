// 临时类型声明文件，用于解决 TanStack Router 的类型问题
declare module '@tanstack/react-router' {
  export function createRouter(options: any): any;
  export function createRootRoute(options?: any): any;
  export function createFileRoute(path: string): any;
  export function useNavigate(): any;
  export function useRouterState(): any;
  export function useLocation(): any;
  export const RouterProvider: any;
  export const Outlet: any;
  export const Link: any;
}