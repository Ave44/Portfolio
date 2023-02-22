import { addSong } from "../../ducks/songs/operations";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { connect } from "react-redux";
import t from "../../ducks/languages/operations";

const SongForm = () => {

    const navigate = useNavigate()

    function submit(values) {
        addSong(values)
        navigate("/music")
    }

    const today = new Date()
    const date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();

    const productSchema = Yup.object().shape({
        title: Yup.string().required(t('Title is required')),
        genre: Yup.string().required(t('Genre is required')),
        productionyear: Yup.date().required(t('Production year is required')).max(today, `${t("It is the future, today is")} ${date}`),
        image: Yup.string(),
        video: Yup.string()
    });

    return (
        <div className="form">
            <div className="title">{t("Add new song")}</div>
            <Formik
                initialValues={{ title: "", genre: "", productionyear: "", image: "", video: "" }}
                validationSchema={productSchema}
                onSubmit={(values) => {submit(values)} }
            >
                <Form>
                    <div>{t("Title:")}</div>
                    <Field name="title" type="text" className="field" />
                    <ErrorMessage name="title" component="div" className='error' />

                    <div>{t("Genre:")}</div>
                    <Field name="genre" type="text" className="field" />
                    <ErrorMessage name="genre" component="div" className='error' />

                    <div>{t("Production Year:")}</div>
                    <Field name="productionyear" type="date" className="field" />
                    <ErrorMessage name="productionyear" component="div" className='error' />

                    <div>{t("Image:")}</div>
                    <Field name="image" type="text" className="field" />
                    <ErrorMessage name="image" component="div" className='error' />

                    <div>{t("Video:")}</div>
                    <Field name="video" type="text" className="field" />
                    <ErrorMessage name="video" component="div" className='error' />

                    <button type="submit">{t("Add")}</button>
                </Form>
            </Formik>
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(SongForm);