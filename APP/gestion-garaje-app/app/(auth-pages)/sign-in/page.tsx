import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-sm w-full">
                <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                <FormMessage message={searchParams} />
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    required
                />
                <Button type="submit" formAction={signInAction}>
                    Iniciar Sesión
                </Button>
                <p className="text-sm text-gray-500">
                    ¿Olvidaste tu contraseña?{" "}
                    <Link
                        href="/forgot-password"
                        className="text-blue-500 underline"
                    >
                        Recuperar
                    </Link>
                </p>
            </form>
        </div>
    );
}
