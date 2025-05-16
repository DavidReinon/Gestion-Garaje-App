import { redirect } from "next/navigation";

const App: React.FC = () => {
    //En home comprobamos mediante el layout si el usuario esta logueado
    redirect("/home");
};

export default App;
