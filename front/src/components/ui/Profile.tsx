import test_profil from '../assets/test_profile.svg';
import lvlHolder from '../assets/lvl_holder.svg';
import nameHolder from '../assets/name_hlder.svg';

function Loby_Profile()
{

    return (
        <>
            <div className='relative h-[400px] w-[400px] bg-customPurple'>
                <img className='absolute ' src={test_profil} alt="" />
                    <img className='absolute bottom-[10px] left-[118px]' src={lvlHolder} alt="" />
                    <div className='absolute bottom-[10px] left-[162px] font-luckiest text-3xl'>LVL 3</div>
                    <img className='absolute bottom-[10px] left-[30px]' src={nameHolder} alt="" />
                    <div className='absolute bottom-[75px] left-[140px] text-customPurple font-luckiest text-3xl'>KACEMO</div>
            </div>
        </>
    );

}

export default Loby_Profile;