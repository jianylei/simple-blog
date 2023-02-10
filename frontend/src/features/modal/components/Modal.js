import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setOpen, selectCurrentType, selectCurrentOpen } from '../modalSlice'
import { MODAL } from '../../../constants/constants'
import useOutsideAlerter from '../../../hooks/useOutsideAlerter'
import SignIn from '../../auth/components/signin/SignIn'
import SignUp from '../../users/components/signup/SignUp'
import ConfirmSignUp from '../../users/components/signup/ConfirmSignUp'

const Modal = () => {
    const [email, setEmail] = useState('')
    const wrapperRef = useRef(null);

    const dispatch = useDispatch()

    const currType = useSelector(selectCurrentType)
    const currOpen = useSelector(selectCurrentOpen)

    useEffect(() => {
        if (currOpen) {
            document.body.style.overflow = 'hidden'
        } 
        return () => document.body.style.overflow = 'unset'
    }, [currOpen])

    const handleClick = () => dispatch(setOpen({ open: false }))

    useOutsideAlerter(wrapperRef, handleClick);

    let content
    
    if (currType === MODAL.TYPE.SIGNIN) {
        content = <SignIn />
    }
    else if (currType === MODAL.TYPE.SIGNUP) {
        content = <SignUp emailState={[email, setEmail]} />
    }
    else if (currType === MODAL.TYPE.CONFIRM) {
        content = <ConfirmSignUp emailState={[email, setEmail]} />
    }

    return (
        <div className={`modal__container ${currOpen?'modal-open':''}`}>
            <section  ref={wrapperRef} className="modal">
                <button className='modal-close' onClick={() => dispatch(setOpen({ open: false }))}>
                    x
                </button>
                {content}
            </section>
        </div>
    )
}

export default Modal