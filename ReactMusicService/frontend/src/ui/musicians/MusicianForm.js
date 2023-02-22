import { addMusician } from "../../ducks/musicians/operations";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { connect } from "react-redux";
import t from "../../ducks/languages/operations";

const MusicianForm = () => {

    const navigate = useNavigate()

    function submit(values) {
        addMusician(values)
        navigate("/musicians")
    }

    const musicianSchema = Yup.object().shape({
        name: Yup.string().required(t('Name is required')),
        country: Yup.string().required(t('Country is required')).matches(/^[a-zA-Z\s]*$/, t("Only letters and spaces are allowed")),
        year: Yup.string().required(t('Year is required')).matches(/^-?[0-2][0-9][0-9][0-9]$/, t("Year must be between -2999 and 2999")),
        image: Yup.string(),

    });

    return (
        <div className="form">
            <div className="title">{t("Add Musician")}</div>
            <Formik
                initialValues={{ name: "", country: "", year: "", image: "" }}
                validationSchema={musicianSchema}
                onSubmit={(values) => {submit(values)} }
            >
                <Form>
                    <div>{t("Name:")}</div>
                    <Field name="name" type="text" className="field" />
                    <ErrorMessage name="name" component="div" className='error' />

                    <div>{t("Origin Country:")}</div>
                    <Field name="country" type="text" className="field" />
                    <ErrorMessage name="country" component="div" className='error' />

                    <div>{t("Active since:")}</div>
                    <Field name="year" type="text" className="field" />
                    <ErrorMessage name="year" component="div" className='error' />
                    
                    <div>{t("Image:")}</div>
                    <Field name="image" type="text" className="field" />
                    <ErrorMessage name="image" component="div" className='error' />

                    <button type="submit">{t("Add")}</button>
                </Form>
            </Formik>
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(MusicianForm);