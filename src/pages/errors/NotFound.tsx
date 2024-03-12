import { Button } from '@/components/ui/button';
import { BiBuoy } from 'react-icons/bi';
import errorImg from '@/assets/images/error-img.png';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={'flex items-center min-h-screen p-6'}>
            <div className="mx-auto">
                <div className={'space-y-4'}>
                    <div className={'text-center'}>
                        <h1 className={'text-[60pt] font-bold flex justify-center items-center'}>
                            4<BiBuoy size={77} className={'animate-spin'} />4
                        </h1>
                        <h4 className="font-bold uppercase">Page Not Found</h4>
                    </div>
                    <div className={'text-center'}>
                        <Button onClick={() => navigate('/')}>Back Home</Button>
                    </div>
                    <div className={'flex justify-center'}>
                        <img src={errorImg} alt="" className="img-fluid w-1/3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
