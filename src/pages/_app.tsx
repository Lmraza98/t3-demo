import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from 'react-hot-toast'
import { GlobalProvider } from "~/contexts/global";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <GlobalProvider>
      <Toaster position='bottom-center'/>
      <Component {...pageProps} />
    </GlobalProvider>
    
  );
};

export default api.withTRPC(MyApp);
