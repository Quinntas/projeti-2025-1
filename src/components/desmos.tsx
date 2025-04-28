import React, {useEffect, useRef} from "react";
import {useDesmos} from "@/hooks/use-desmos";
import {v4} from "uuid";

interface DesmosProps {
    content: string;
}

export const Desmos = React.memo(function Desmos(props: DesmosProps) {
    const {scriptLoaded, initCalculator} = useDesmos()
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scriptLoaded && divRef.current) {
            const calc = initCalculator(divRef.current, {
                expressions: true,
            })

            calc?.setExpression({id: v4(), latex: props.content})
        }
    }, [scriptLoaded, initCalculator, props.content])

    return <div className={"w-full h-full overflow-hidden"}>
        <div
            ref={divRef}
            className={"w-[100%] h-[400px]"}
        />
    </div>
})