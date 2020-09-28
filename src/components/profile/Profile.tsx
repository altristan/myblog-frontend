import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useAuth0 } from '../../contexts/auth0-context';

function Profile(): JSX.Element {
    let history = useHistory();
    const { user, getIdTokenClaims } = useAuth0();

    interface IValues {
        [key: string]: any;
    }
    const [author, setAuthor] = useState<string>('');
    const [values, setValues] = useState<IValues>([]);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setAuthor(user.name)
        }
    }, [user])

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        // e.preventDefault();
        setLoading(true);
        const formData = {
            username: values.username,
            given_name: values.given_name,
            family_name: values.family_name,
            phone_number: values.phone_number,
            email: values.email,
        }
        const submitSuccess: boolean = await submitform(formData);
        setSubmitSuccess(submitSuccess);
        setValues({...values, formData});
        setLoading(false);
        setTimeout(() => {
            history.push('/');
        }, 1500);
    }

    const submitform = async (formData: {}) => {
        try {
            const accessToken = await getIdTokenClaims();
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/profile/user`, {
                method: "post",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "authorization": `Bearer ${accessToken.__raw}`
                }),
                body: JSON.stringify(formData)
            });
            return response.ok;
        } catch (ex) {
            return false;
        }
    }
    const setFormValues = (formValues: IValues) => {
        setValues({...values, ...formValues})
    }
    const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        // e.preventDefault();
        setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
    }

    return (
        <div className="profile-area">
            <div className={"col-md-12 form-wrapper"}>
                <h2> Welcome! </h2>
                {!submitSuccess && (
                    <div className="alert alert-info" role="alert">
                        Please finish setting up your profile below.
                    </div>
                )}
                {submitSuccess && (
                    <div className="alert alert-info" role="alert">
                        The form was successfully submitted!
                    </div>
                )}
                <form id={"create-profile-form"} onSubmit={handleFormSubmission} noValidate={true}>
                    <div className="form-group col-md-12">
                        <label htmlFor="username"> Username </label>
                        <input type="text"
                               id="username"
                               onChange={(e) => handleInputChanges(e)}
                               name="username" className="form-control"
                               placeholder="Enter username" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="given_name"> First Name </label>
                        <input type="text"
                               id="given_name"
                               onChange={(e) => handleInputChanges(e)}
                               name="given_name"
                               className="form-control"
                               placeholder="Enter first name" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="family_name"> Last Name </label>
                        <input type="text"
                               id="family_name"
                               onChange={(e) => handleInputChanges(e)}
                               name="family_name"
                               className="form-control"
                               placeholder="Enter last name" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="phone_number"> Contact No. </label>
                        <input type="text"
                               id="phone_number"
                               onChange={(e) => handleInputChanges(e)}
                               name="phone_number"
                               className="form-control"
                               placeholder="Enter contact number" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="email"> Email </label>
                        <input type="text"
                               id="email"
                               defaultValue={author}
                               onChange={(e) => handleInputChanges(e)}
                               name="email"
                               className="form-control"
                               placeholder="Enter email" />
                    </div>
                    <div className="file-upload-wrapper">
                        <input type="file" id="input-file-now" className="file-upload"/>
                    </div>
                    <div className="form-group col-md-4 pull-right">
                        <button className="btn btn-success" type="submit">
                            Create
                        </button>
                        {loading &&
                        <span className="fa fa-circle-o-notch fa-spin" />
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}
export default withRouter(Profile)