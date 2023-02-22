import { connect } from "react-redux";
import { editSong } from "../../ducks/songs/operations";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import t from "../../ducks/languages/operations";

const SongEdit = ({songs}, props) => {

    const navigate = useNavigate()
    const title = useParams().title
    const song = songs.filter(song => {return song.title === title ? 1 : 0})[0]

    function submit(values) {
        editSong({...values, id: song.id})
        navigate(`/music/${values.title}`)
    }

    const today = new Date()
    const date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();

    const productSchema = Yup.object().shape({
        title: Yup.string().required(t('Title is required')),
        genre: Yup.string().required(t('Genre is required')),
        productionyear: Yup.date().required(t('Production year is required')).max(today, `${t('It is the future, today is')} ${date}`),
        image: Yup.string(),
        video: Yup.string()
    });

    const form = (song) => {
        if (song) {
            return (
                <Formik
                    initialValues={{ title: song.title, genre: song.genre, productionyear: song.productionyear, image: song.image, video: song.video }}
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

                        <button type="button" onClick={()=>{navigate(`/music/${song.title}/asign/${song.id}`)}}>{t("Asign Authors")}</button>
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
            {form(song)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({songs: state.songsReducer.songs, language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(SongEdit);