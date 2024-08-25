"use client";

import { SessionProvider as Provider} from "next-auth/react";

type PropsType = {
    children: React.ReactNode
}

export default function SessionProvider({children} : PropsType) {
    return <Provider>{children}</Provider>
}