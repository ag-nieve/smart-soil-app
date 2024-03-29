import {View, Text, TouchableOpacity, Image} from "react-native";
import {useUserStore} from "../../zustand_store/auth";
import {useState} from "react";
import Input from "../../components/Input";
import {Ionicons} from "@expo/vector-icons";


export default function SignupForm(props){

    const { setIsLogin } = props;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState({
        email : "",
        password: ""
    });


    const login = useUserStore((state) => state.login);

    const signupHandler = async () => {
        const base_url = `https://soil-moisture-database-eea02-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`;

        const errors = {};

        if(username === "") {
            errors.username = "Username is required";
        }

        if(email === "") {
            errors.email = "Email is required";
        }

        if(password === "") {
            errors.password = "Password is required";
        }

        if(password.length < 8) {
            errors.password = "Password should be at least 8 characters";
        }

        if(Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }


        const options = {
            method: "POST",
            body: JSON.stringify({
                'username': username,
                'email' : email,
                'password': password,
                'dateTime': new Date()
            })
        }

        const response = await fetch(base_url, options);
        // console.log(await response.json());

        if(!response.ok){
            setError({
                "result" : "Registration failed. Something went wrong."
            });
            return;
        }

        setIsSuccess(true);

    };

    return <View className={'flex flex-1 p-5 justify-center items-center bg-primaryColor'}>

        <Image className={'w-44 h-44 mb-3'} source={require('../../assets/logo.png')} />
        {
            error.result ? <View className={'p-2 rounded-lg bg-red-500 w-full '}>
                    <Text className='text-white'>{error.result}</Text>
                </View> : null
        }
        {
            error.email || error.password ? <View className={'w-full p-2 rounded-lg bg-red-500'}>
                {error.email && <Text className='text-white'>- {error.email}</Text>}
                {error.password && <Text className='text-white'>- {error.password}</Text>}
            </View> : null
        }
        {
            isSuccess ?
                <View className={'p-4 bg-green-400 rounded-xl w-full flex flex-row justify-between'}>
                    <Text className={'text-white'}>Registration Success! Please Login</Text>
                    <TouchableOpacity onPress={()=> {
                        setIsSuccess(false);
                        setUsername("");
                        setEmail("");
                        setPassword("");
                    }}><Ionicons name={'close'} size={15} color={'#fff'} /></TouchableOpacity>
                </View>:null
        }
        <Input
            addStyle={'bg-white'}
            placeholder="Set your username"
            value={username}
            onChangeText={(val) => setUsername(val)}
        />
        <Input
            addStyle={'bg-white'}
            placeholder="Set your email"
            value={email}
            onChangeText={(val) => setEmail(val)}
        />
        <Input
            secureTextEntry
            addStyle={'bg-white'}
            placeholder="Set your password"
            value={password}
            onChangeText={(val) => setPassword(val)}
        />
        <View className={'flex flex-row'}>
            <TouchableOpacity onPress={signupHandler} className={'rounded-lg py-3 w-full bg-secondaryColor'}>
                <Text className={'text-center text-[#ffffff]'}>Signup</Text>
            </TouchableOpacity>
        </View>
        <View className={'flex flex-row mt-3'}>
            <Text>Already a member? </Text>
            <TouchableOpacity onPress={()=> setIsLogin(true)}><Text className={'text-secondaryColor'}>Login</Text></TouchableOpacity>
        </View>
    </View>
}
