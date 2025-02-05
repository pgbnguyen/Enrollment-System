import { Formik } from "formik";
import { Paper, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { firestore } from "../../firebase";
import * as Yup from "yup";
import { useState, useEffect } from "react";

const CourseSchema = Yup.object().shape({
    courseDescription: Yup.string()
        .min(20, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
        courseDescription: Yup.string()
            .min(20, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
            courseCode:Yup.string()
            .min(6, 'Too Short!')
            .required('Required')
            // to check if the course code is unique
            .test('checkCourseCodeUnique', 'This course is already registered',async value =>{
                let isCourseCodeUnique = false;
                if(!value)
                {
                    value = " "
                }
                console.log(value)
                await firestore.collection("courses").where("courseCode", "==", value).get().then((val)=>{
                    isCourseCodeUnique = val.empty;
                })
                return isCourseCodeUnique;
            }),
    
});
function CreateCourse() {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" }


    let [error, setError] = useState("");
    let [professorData, setProfessorData] = useState([]);

    useEffect(() => {
        firestore.collection("professors").get().then((professors) => {
            setProfessorData(professors.docs.map((professor => professor.data())));
        })
    }, [])

    return (

        <article>
            <Grid>
                <Paper elavation="20" style={paperStyle}>
                    <Grid >
                        <h2>Create Course</h2>
                    </Grid>
                    <Formik validationSchema={CourseSchema} initialValues={{ courseName: '', courseCode: '', courseDescription: '',professorName: ''}} onSubmit={async (values, props) => {
                        console.log(values)
                        props.setSubmitting(true);
                        await firestore.collection("courses").add({
                            "courseName":values.courseName,
                            "courseDescription":values.courseDescription,
                            "courseCode":values.courseCode,
                            "professorName":values.professorName,



                        }).then(async(val)=>{
                           await val.update({ "id": val.id });


                            alert("Course Successfully Created")
                        }).catch((err)=>{
                            console.log(err);
                        })


                    }} validateOnChange={true}
                        validateOnBlur={true}>
                        {props => (
                            <form onSubmit={props.handleSubmit}>
                                <label htmlFor="courseName">Course Name</label>
                                <TextField type="text"
                                    name="courseName"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    value={props.values.courseName}
                                />
                                <label htmlFor="courseCode">Course Code</label>
                                <TextField type="text"
                                    name="courseCode"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    value={props.values.courseCode}
                                    helperText={props.errors.courseCode}
                                    error={props.errors.courseCode}
                                />
                                <label> Professor Name</label>
                                <br></br>
                                <br></br>
                                <select onChange={(value)=>{props.values.professorName = value.target.value; console.log(props.values.professorName)}}>
                                    {professorData.map((professor) =>
                                    <option key={professor.email}> {professor.firstname} {professor.lastname}</option>)};
                             </select>
                                <br></br><br></br>
                                <label> Course Description</label>
                                <TextField type="text"
                                    multiline={true}
                                    name="courseDescription"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    value={props.values.courseDescription}
                                    helperText={props.errors.courseDescription}
                                    error={!!props.errors.courseDescription}
                                />
                                <button type="submit">Submit</button>
                                <button type="reset">reeset</button>
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Grid>
        </article>
    )
}

export default CreateCourse;