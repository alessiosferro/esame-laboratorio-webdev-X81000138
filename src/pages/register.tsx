import {Button, Flex, FormControl, FormLabel, Heading, Link as ChakraLink, useToast} from "@chakra-ui/react";
import {Input} from "@chakra-ui/input";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import Link from "next/link";
import useCreateUser from "@/hooks/use-create-user";
import RegisterUserModel from "@/model/register-user.model";
import {useRouter} from "next/router";
import useIsClientLoaded from "@/hooks/use-is-client-loaded";
import useRedirectEffect from "@/hooks/use-redirect-effect";
import {useContext} from "react";
import {AppContext} from "@/app.context";

const formDefaultValues = {
    nome: "",
    cognome: "",
    email: ""
}

const RegisterPage = () => {
    const form = useForm<RegisterUserModel>({
        defaultValues: formDefaultValues
    });

    const toast = useToast();

    const {mutateAsync: createUser} = useCreateUser();

    const {push} = useRouter();

    const isClientLoaded = useIsClientLoaded();

    const {state: {userId}} = useContext(AppContext);

    useRedirectEffect();

    const submitHandler: SubmitHandler<RegisterUserModel> = async (formData) => {
        try {
            await createUser(formData);
            void push('/');

            toast({
                title: "Account registrato",
                description: "L'account è stato registrato con successo",
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        } catch {
            toast({
                title: "Errore registrazione",
                description: "C'è stato un problema durante la registrazione, riprova più tardi.",
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    }

    if (!isClientLoaded || !!userId) return null;

    return (
        <FormProvider {...form}>
            <Flex onSubmit={form.handleSubmit(submitHandler)}
                  direction="column"
                  flex={1}
                  gap="1rem"
                  as="form">
                <Heading as="h2" variant="h2">
                    Form di registrazione
                </Heading>

                <Link legacyBehavior passHref href="/">
                    <ChakraLink>Torna indietro</ChakraLink>
                </Link>

                <Controller name="nome" render={({field: {value, onChange}}) => (
                    <FormControl>
                        <FormLabel>Nome</FormLabel>
                        <Input value={value} onChange={onChange} required/>
                    </FormControl>
                )}/>

                <Controller name="cognome" render={({field: {value, onChange}}) => (
                    <FormControl>
                        <FormLabel>Cognome</FormLabel>
                        <Input value={value} onChange={onChange} required/>
                    </FormControl>
                )}/>

                <Controller name="email" render={({field: {value, onChange}}) => (
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input value={value} onChange={onChange} required type="email"/>
                    </FormControl>
                )}/>

                <Button mt="1rem" type="submit">Registrati</Button>
            </Flex>
        </FormProvider>
    );
}

export default RegisterPage;