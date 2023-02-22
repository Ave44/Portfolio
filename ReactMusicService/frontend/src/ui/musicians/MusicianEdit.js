import { connect } from "react-redux";
import { editMusician } from "../../ducks/musicians/operations";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import t from "../../ducks/languages/operations";

const MusicianEdit = ({musicians}, props) => {

    const navigate = useNavigate()
    const name = useParams().name
    const musician = musicians.filter(musician => {return musician.name === name ? 1 : 0})[0]

    function submit(values) {
        editMusician({...values, id: musician.id})
        navigate(`/musicians/${values.name}`)
    }

    const musicianSchema = Yup.object().shape({
        name: Yup.string().required(t('Name is required')),
        country: Yup.string().required(t('Country is required')).matches(/^[a-zA-Z\s]*$/, t("Only letters and spaces are allowed")),
        year: Yup.string().required(t('Year is required')).matches(/^-?[0-2][0-9][0-9][0-9]$/, t("Year must be between -2999 and 2999")),
        image: Yup.string(),

    });

    const form = (musician) => {
        if (musician) {
            return (
                <Formik
                initialValues={{ name: musician.name, country: musician.country, year: musician.year, image: musician.image }}
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

                    <button type="submit">{t("Save")}</button>
                </Form>
            </Formik>
            )
        }
        return <div>...</div>
    }
    return (
        <div className="form">
            <div className="title">{t("Edit")}</div>
            {form(musician)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({musicians: state.musiciansReducer.musicians, language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(MusicianEdit);