import {AnimatePresence, motion} from "framer-motion"


interface Props {
    children: string;
}

export const UserMessage = ({children}: Props) => {
    return <AnimatePresence mode="wait">
        <motion.div
            className="w-full flex items-center justify-end my-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{duration: 0.3}}
        >
            <motion.div
                className="rounded-lg bg-muted p-3 shadow-sm border"
                initial={{scale: 0.95}}
                animate={{scale: 1}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
            >
                <p className="whitespace-pre-wrap leading-6">{children}</p>
            </motion.div>
        </motion.div>
    </AnimatePresence>
};
