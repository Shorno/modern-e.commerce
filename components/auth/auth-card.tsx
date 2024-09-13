import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {BackButton} from "@/components/auth/back-button";
import Socials from "@/components/auth/socials";

type CardWrapperProps = {
    children: React.ReactNode;
    cardTitle: string;
    backButtonHref: string;
    backButtonLabel: string;
    showSocials?: boolean;

}
export const AuthCard = ({
                             children,
                             cardTitle,
                             backButtonHref,
                             backButtonLabel,
                             showSocials,
                         }: CardWrapperProps) => {
    return (
        <>
            <Card className={"lg:max-w-96 mx-auto"}>
                <CardHeader>
                    <CardTitle>{cardTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                {
                    showSocials && (
                        <CardFooter>
                            <Socials/>
                        </CardFooter>
                    )
                }
                <CardFooter>
                    <BackButton href={backButtonHref} label={backButtonLabel}/>
                </CardFooter>
            </Card>
        </>
    );

}